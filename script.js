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

let isResizing = false;
let resizingItem = null;
let startX, startWidth;

grid.addEventListener('mousedown', (e) => {
  if (e.target.classList.contains('resizer')) {
    e.stopPropagation();
    isResizing = true;
    resizingItem = e.target.closest('.grid-item');
    startX = e.clientX;
    startWidth = parseInt(document.defaultView.getComputedStyle(resizingItem).width, 10);
    document.body.style.cursor = 'se-resize';
  }
});

document.addEventListener('mousemove', (e) => {
  if (!isResizing || !resizingItem) return;
  let grid = document.getElementById('grid');
  let gridStyles = window.getComputedStyle(grid);
  let columnGap = parseInt(gridStyles.gap || gridStyles.columnGap || '16', 10);
  let minColWidth = 150;
  let newWidth = startWidth + (e.clientX - startX);
  let snappedCols = Math.round(newWidth / (minColWidth + columnGap));
  snappedCols = Math.max(snappedCols, 1);
  let snappedWidth = snappedCols * minColWidth + (snappedCols - 1) * columnGap;
  resizingItem.style.width = snappedWidth + 'px';
});

document.addEventListener('mouseup', () => {
  if (isResizing) {
    isResizing = false;
    resizingItem = null;
    document.body.style.cursor = '';
  }
});