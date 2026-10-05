// Select DOM Elements
const noteText = document.getElementById('note-text');
const charCount = document.getElementById('char-count');
const wordCount = document.getElementById('word-count');
const clearBtn = document.getElementById('clear-btn');
const themeToggle = document.getElementById('theme-toggle');

// Function to update character & word counts + warning classes
function updateCounts() {
  const text = noteText.value;
  const numChars = text.length;

  // Word count logic (handles whitespace/empty text)
  const trimmedText = text.trim();
  const numWords = trimmedText === '' ? 0 : trimmedText.split(/\s+/).length;

  // Update text content
  charCount.textContent = `${numChars} / 200 characters`;
  wordCount.textContent = `${numWords} words`;

  // Manage warning / over classes on character count
  charCount.classList.remove('warning', 'over');
  if (numChars > 200) {
    charCount.classList.add('over');
  } else if (numChars > 180) {
    charCount.classList.add('warning');
  }
}

// Clear input, reset display, and remove draft from localStorage
function clearAll() {
  noteText.value = '';
  localStorage.removeItem('draft');
  updateCounts();
}

// Event Listeners
noteText.addEventListener('input', () => {
  updateCounts();
  localStorage.setItem('draft', noteText.value);
});

noteText.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    clearAll();
  }
});

clearBtn.addEventListener('click', clearAll);

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  
  themeToggle.textContent = isDark ? 'Light mode' : 'Dark mode';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Initial Restore on Page Load
window.addEventListener('DOMContentLoaded', () => {
  // Restore Draft
  const savedDraft = localStorage.getItem('draft');
  if (savedDraft !== null) {
    noteText.value = savedDraft;
  }

  // Restore Theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    themeToggle.textContent = 'Light mode';
  } else {
    themeToggle.textContent = 'Dark mode';
  }

  // Calculate counts for restored draft
  updateCounts();
});