import { ref, listAll, uploadBytesResumable, getDownloadURL, deleteObject } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js';

const IMAGE_EXTENSION = /\.(png|jpe?g|webp|gif|avif|svg|bmp)$/i;
const UPLOAD_PREFIX = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}--/i;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

function imageName(name) {
  return name.replace(UPLOAD_PREFIX, '').replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ');
}

// Uses the same customers/ inventory as the public homepage, including existing uploads.
export function initBrandImages({ storage, auth, compressImage, showToast, showConfirm }) {
  const section = document.getElementById('brand-images-section');
  const form = document.getElementById('brand-images-form');
  const input = document.getElementById('brand-images-files');
  const selection = document.getElementById('brand-images-selection');
  const list = document.getElementById('brand-images-list');
  const count = document.getElementById('brand-images-count');
  const status = document.getElementById('brand-images-status');
  const title = document.getElementById('brand-images-form-title');
  const save = document.getElementById('brand-images-save');
  const cancel = document.getElementById('brand-images-cancel');
  let selected = [];
  let previewUrls = [];
  let replacing = null;
  let busy = false;
  let loading = false;
  let loadId = 0;

  function updateControls() {
    section.querySelectorAll('button, input').forEach(el => { el.disabled = busy || loading; });
    save.disabled = busy || loading || !selected.length;
    save.textContent = replacing ? 'Save Replacement' : 'Add Images';
    cancel.hidden = !replacing && !selected.length;
    input.multiple = !replacing;
    form.setAttribute('aria-busy', String(busy));
  }

  function button(label, className, action) {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = `btn ${className}`;
    el.textContent = label;
    el.addEventListener('click', action);
    return el;
  }

  function renderSelection() {
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    previewUrls = [];
    selection.replaceChildren();
    selected.forEach((file, i) => {
      const figure = document.createElement('figure');
      const img = document.createElement('img');
      const url = URL.createObjectURL(file);
      previewUrls.push(url);
      img.src = url;
      img.alt = `Preview of ${file.name}`;
      img.addEventListener('error', () => { img.hidden = true; }, { once: true });
      const caption = document.createElement('figcaption');
      caption.textContent = file.name;
      const remove = button('Remove', 'btn-ghost', () => {
        selected.splice(i, 1);
        input.value = '';
        renderSelection();
      });
      remove.setAttribute('aria-label', `Remove ${file.name} from selection`);
      figure.append(img, caption, remove);
      selection.appendChild(figure);
    });
    title.textContent = replacing ? `Replace ${replacing.name}` : 'Add brand images';
    updateControls();
  }

  function resetForm() {
    selected = [];
    replacing = null;
    input.value = '';
    status.textContent = '';
    renderSelection();
  }

  function renderState(message, retry = false) {
    const wrap = document.createElement('div');
    wrap.className = 'products-state';
    const text = document.createElement('p');
    text.textContent = message;
    wrap.appendChild(text);
    if (retry) wrap.appendChild(button('Try Again', 'btn-secondary', () => load()));
    list.replaceChildren(wrap);
  }

  function renderImages(images) {
    count.textContent = `${images.length} ${images.length === 1 ? 'image' : 'images'}`;
    list.replaceChildren();
    if (!images.length) {
      renderState('No brand images yet. Add images above to show them on the homepage.');
      return;
    }
    images.forEach(image => {
      const card = document.createElement('article');
      card.className = 'brand-image-card';
      const preview = document.createElement('div');
      preview.className = 'brand-image-preview';
      if (image.url) {
        const img = document.createElement('img');
        img.src = image.url;
        img.alt = image.name;
        img.loading = 'lazy';
        img.addEventListener('error', () => { preview.textContent = 'Preview unavailable'; }, { once: true });
        preview.appendChild(img);
      } else {
        preview.textContent = 'Preview unavailable';
      }
      const body = document.createElement('div');
      body.className = 'brand-image-body';
      const name = document.createElement('h3');
      name.className = 'brand-image-name';
      name.textContent = image.name;
      const actions = document.createElement('div');
      actions.className = 'brand-image-actions';
      const replace = button('Replace', 'btn-secondary', () => {
        if (busy || loading) return;
        resetForm();
        replacing = image;
        renderSelection();
        input.focus();
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      replace.setAttribute('aria-label', `Replace ${image.name}`);
      const remove = button('Remove', 'btn-danger', () => removeImage(image));
      remove.setAttribute('aria-label', `Remove ${image.name}`);
      actions.append(replace, remove);
      body.append(name, actions);
      card.append(preview, body);
      list.appendChild(card);
    });
  }

  async function load() {
    if (busy) return;
    const requestId = ++loadId;
    if (!auth.currentUser) {
      count.textContent = '';
      renderState('Sign in to manage brand images.');
      return;
    }
    loading = true;
    list.setAttribute('aria-busy', 'true');
    count.textContent = '';
    renderState('Loading brand images…');
    updateControls();
    try {
      const result = await listAll(ref(storage, 'customers'));
      const items = result.items.filter(item => IMAGE_EXTENSION.test(item.name));
      const images = await Promise.all(items.map(async item => {
        const image = { path: item.fullPath, name: imageName(item.name), url: '' };
        try { image.url = await getDownloadURL(item); } catch (err) { console.warn('Brand image preview unavailable:', item.fullPath, err); }
        return image;
      }));
      if (requestId !== loadId || !auth.currentUser) return;
      images.sort((a, b) => a.name.localeCompare(b.name));
      renderImages(images);
    } catch (err) {
      if (requestId !== loadId) return;
      console.error('Could not load brand images:', err);
      renderState('Could not load brand images. Check your connection and try again.', true);
    } finally {
      if (requestId === loadId) {
        loading = false;
        list.setAttribute('aria-busy', 'false');
        updateControls();
      }
    }
  }

  async function deleteIfExists(path) {
    try { await deleteObject(ref(storage, path)); }
    catch (err) { if (err.code !== 'storage/object-not-found') throw err; }
  }

  async function discardUpload(path) {
    try { await deleteIfExists(path); }
    catch (err) {
      console.warn('Could not clean up brand upload:', err);
      const failure = new Error('An extra image may have been uploaded. Refresh the list and remove any duplicate before trying again.');
      failure.cleanupFailed = true;
      throw failure;
    }
  }

  async function uploadImage(file) {
    const compressed = await compressImage(file, 1200, 0.9);
    if (!auth.currentUser) throw new Error('Sign in again before saving images.');
    const contentType = compressed.type || 'image/webp';
    const extension = ({ 'image/webp': 'webp', 'image/png': 'png', 'image/jpeg': 'jpg', 'image/gif': 'gif', 'image/avif': 'avif', 'image/svg+xml': 'svg', 'image/bmp': 'bmp' })[contentType];
    if (!extension) throw new Error('This image format could not be optimized. Please use PNG, JPEG, or WebP.');
    const base = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_.-]/g, '_').slice(0, 120) || 'brand';
    // A new URL for every replacement avoids the old logo remaining in browser caches.
    const path = `customers/${crypto.randomUUID()}--${base}.${extension}`;
    const target = ref(storage, path);
    try {
      await new Promise((resolve, reject) => {
        const task = uploadBytesResumable(target, compressed, { contentType, cacheControl: 'public,max-age=31536000,immutable' });
        task.on('state_changed', snap => {
          const percent = snap.totalBytes ? Math.round(snap.bytesTransferred / snap.totalBytes * 100) : 0;
          status.textContent = `Uploading ${file.name}: ${percent}%`;
        }, reject, resolve);
      });
      await getDownloadURL(target);
      return path;
    } catch (err) {
      await discardUpload(path);
      throw err;
    }
  }

  async function removeImage(image) {
    if (busy || loading || !auth.currentUser) return;
    busy = true;
    updateControls();
    try {
      const confirmed = await showConfirm(`Remove ${image.name} from the homepage? This deletes the image from brand storage.`, 'Remove');
      if (!confirmed || !auth.currentUser) return;
      await deleteIfExists(image.path);
      if (replacing?.path === image.path) resetForm();
      showToast('Brand image removed');
    } catch (err) {
      showToast(err.message || 'Could not remove brand image. Please try again.', 'error');
    } finally {
      busy = false;
      updateControls();
      await load();
    }
  }

  input.addEventListener('change', () => {
    const files = Array.from(input.files || []);
    if (!files.length || busy || loading) return;
    if (files.some(file => !/^image\//i.test(file.type) && !/\.(png|jpe?g|gif|webp|avif|bmp|svg|heic|heif)$/i.test(file.name))) {
      input.value = '';
      return showToast('Please select image files only.', 'error');
    }
    if (files.some(file => file.size > MAX_IMAGE_BYTES)) {
      input.value = '';
      return showToast('Each image must be 10 MB or smaller.', 'error');
    }
    selected = replacing ? files.slice(0, 1) : files;
    status.textContent = '';
    renderSelection();
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy || loading || !selected.length) return;
    if (!auth.currentUser) return showToast('Sign in again before saving images.', 'error');
    busy = true;
    updateControls();
    let completed = 0;
    try {
      for (const file of selected) {
        status.textContent = `Preparing ${file.name}…`;
        const path = await uploadImage(file);
        if (replacing) {
          try { await deleteIfExists(replacing.path); }
          catch (err) {
            // Keep the original if replacement cannot finish, and roll back the new upload.
            await discardUpload(path);
            throw err;
          }
        }
        completed++;
      }
      const message = replacing ? 'Brand image replaced' : `${completed} brand ${completed === 1 ? 'image' : 'images'} added`;
      resetForm();
      status.textContent = message;
      showToast(message);
    } catch (err) {
      selected = selected.slice(completed);
      renderSelection();
      status.textContent = err.cleanupFailed ? err.message : (completed ? `${completed} images added. The remaining images could not be saved; please retry.` : 'Images could not be saved. Please try again.');
      showToast(err.message || status.textContent, 'error');
    } finally {
      busy = false;
      updateControls();
      await load();
    }
  });

  cancel.addEventListener('click', resetForm);
  document.getElementById('brand-images-refresh').addEventListener('click', () => load());
  updateControls();
  return { load };
}
