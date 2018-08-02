/**
 * 
 * @param {Array<[number, number, number]>} colors
 * @returns {string?}
 */
const testColor = async function (colors, width, height) {
  const canvas = document.createElement('canvas');
  Object.assign(canvas, { width: width * colors.length, height });
  document.body.appendChild(canvas);
  const context = canvas.getContext('2d');
  colors.forEach((color, index) => {
    context.fillStyle = '#' +
      color.map(channel => channel.toString(16).padStart(2, 0)).join('');
    context.fillRect(width * index, 0, width * (1 + index), height);
  });
  const url = canvas.toDataURL();
  const images = document.getElementById('images');
  const image = document.createElement('img');
  await new Promise(resolve => {
    image.onload = () => resolve();
    image.src = url;
  });
  images.appendChild(image);
  const results = document.getElementById('results');
  const result = document.createElement('div');
  const canvas2 = document.createElement('canvas');
  Object.assign(canvas2, { width: width * colors.length, height });
  document.body.appendChild(canvas2);
  const context2 = canvas2.getContext('2d');
  context2.drawImage(image, 0, 0);
  const pass = colors.map((color, index) => {
    const data = context2.getImageData(width * index, 0, width, height).data;
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
    return pass;
  });
  results.appendChild(result);
  document.body.removeChild(canvas);
  document.body.removeChild(canvas2);
  return pass.every(Boolean) ? url : null;
};

const main = async function () {
  const colors = [
    [255, 0, 0],
    [0, 255, 0],
    [0, 0, 255],
    [255, 255, 0],
    [255, 0, 255],
    [0, 255, 255],
    [1, 1, 1],
    [254, 254, 254],
    [0, 0, 0],
    [51, 51, 51],
    [102, 102, 102],
    [153, 153, 153],
    [204, 204, 204],
    [255, 255, 255],
  ];
  const url1 = await testColor(colors, 100, 100);
  const url2 = await testColor(colors, 100, 100);
  const result = url1 && url2 && url1 === url2;
  const final = document.getElementById('final');
  final.textContent = result ? 'Not detected' : 'Detected';
};

window.addEventListener('load', () => {
  setTimeout(() => {
    try {
    main();
    } catch (e) {alert(e); console.log(e);}
  }, 0);
});