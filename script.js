const grid = document.getElementById('grid');
let draggedItem = null;
let dragOverItem = null;

// Drag and Drop

grid.addEventListener('dragstart', (e) => {
  if (e.target.classList.contains('grid-item')) {
    draggedItem = e.target;
    setTimeout(() => {
      e.target.classList.add('dragging');
    }, 0);
  }
});

grid.addEventListener('dragend', (e) => {
  if (draggedItem) {
    draggedItem.classList.remove('dragging');
    draggedItem = null;
  }
});

grid.addEventListener('dragover', (e) => {
  e.preventDefault();
  const afterElement = getDragAfterElement(grid, e.clientY, e.clientX);
  if (afterElement == null) {
    grid.appendChild(draggedItem);
  } else {
    grid.insertBefore(draggedItem, afterElement);
  }
});

function getDragAfterElement(container, y, x) {
  const draggableElements = [...container.querySelectorAll('.grid-item:not(.dragging)')];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2 + x - box.left - box.width / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: -Infinity }).element;
}

// Resizing

grid.querySelectorAll('.grid-item').forEach(item => {
  const resizer = item.querySelector('.resizer');
  let isResizing = false;
  let startX, startY, startWidth, startHeight;

  resizer.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    isResizing = true;
    startX = e.clientX;
    startY = e.clientY;
    startWidth = parseInt(document.defaultView.getComputedStyle(item).width, 10);
    startHeight = parseInt(document.defaultView.getComputedStyle(item).height, 10);
    document.body.style.cursor = 'se-resize';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    let newWidth = startWidth + (e.clientX - startX);
    let newHeight = startHeight + (e.clientY - startY);
    newWidth = Math.max(newWidth, 100);
    newHeight = Math.max(newHeight, 100);
    item.style.width = newWidth + 'px';
    item.style.height = newHeight + 'px';
  });

  document.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false;
      document.body.style.cursor = '';
    }
  });
});