/**
 * 
 * @param {[number, number, number]} color 
 * @returns {string?}
 */
const testColor = function (color, width, height) {
  const canvas = document.createElement('canvas');
  Object.assign(canvas, { width, height });
  document.body.appendChild(canvas);
  const context = canvas.getContext('2d');
  context.fillStyle = '#' +
    color.map(channel => channel.toString(16).padStart(2, 0)).join('');
  context.fillRect(0, 0, 100, 100);
  const url = canvas.toDataURL();
  const image = document.createElement('img');
  image.src = url;
  const results = document.getElementById('results');
  const result = document.createElement('div');
  result.className = 'result';
  result.appendChild(image);
  const canvas2 = document.createElement('canvas');
  Object.assign(canvas, { width, height });
  document.body.appendChild(canvas2);
  const context2 = canvas2.getContext('2d');
  context2.drawImage(image, 0, 0);
  const data = context2.getImageData(0, 0, 100, 100).data;
  const pixels = new Uint32Array(data.buffer);
  const colors = new Map();
  pixels.forEach(pixel => {
    colors.set(pixel, (colors.get(pixel) || 0) + 1);
  });
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  table.appendChild(thead);
  const tr = document.createElement('tr');
  thead.appendChild(tr);
  ['R', 'G', 'B', 'A', 'Count'].forEach(text => {
    const th = document.createElement('th');
    th.textContent = text;
    tr.appendChild(th);
  });
  const tbody = document.createElement('tbody');
  table.appendChild(tbody);
  [...colors.entries()].forEach(([key, value]) => {
    const color = new Uint8Array(new Uint32Array([key]).buffer);
    const line = document.createElement('tr');
    [...color, value].forEach(value => {
      const ceil = document.createElement('td');
      ceil.textContent = value;
      line.appendChild(ceil);
    });
    tbody.appendChild(line);
  });
  result.appendChild(table);
  const target = new Uint32Array(new Uint8Array([...color, 255]).buffer)[0];
  const count = colors.has(target) ? colors.get(target) : 0;
  const pass = count === width * height;
  const message = document.createElement('div');
  message.textContent = pass ? 'Pass' : 'Fail';
  result.appendChild(message);
  results.appendChild(result);
  document.body.removeChild(canvas);
  document.body.removeChild(canvas2);
  return pass ? url : null;
};

window.addEventListener('load', () => {
  setTimeout(() => {
    const results = [
      [255, 255, 255],
      [255, 0, 0],
      [0, 255, 0],
      [0, 0, 255],
      [255, 255, 0],
      [255, 0, 255],
      [0, 255, 255],
      [0, 0, 0],
      [51, 51, 51],
      [102, 102, 102],
      [153, 153, 153],
      [204, 204, 204],
    ].map(color => {
      const results = document.getElementById('results');
      const line = document.createElement('hr');
      results.appendChild(line);
      const message = document.createElement('div');
      results.appendChild(message);
      try {
        const result1 = testColor(color, 100, 100);
        const result2 = testColor(color, 100, 100);
        if (result1 && result2 && result1 === result2) {
          message.textContent = 'Pass';
          return true;
        }
      } catch (e) {
        message.textContent = 'JS Failed to run: ' + e;
        return false;
      }
      message.textContent = 'Failed';
      return false;
    });
    const final = document.getElementById('final');
    const text = results.every(Boolean) ? 'Not detected' : 'Detected';
    final.textContent = text;
  }, 0);
});