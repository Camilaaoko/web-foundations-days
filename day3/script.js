// Starting Data
let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

// 1. searchNotes(word)
function searchNotes(word) {
  if (!word) return [];
  const lowerWord = word.toLowerCase();
  return notes.filter((note) => note.text.toLowerCase().includes(lowerWord));
}

// 2. longestNote()
function longestNote() {
  if (notes.length === 0) return null;
  return notes.reduce((longest, current) => {
    return current.text.length > longest.text.length ? current : longest;
  });
}

// 3. countByCategory()
function countByCategory() {
  const counts = {};
  for (const note of notes) {
    counts[note.category] = (counts[note.category] || 0) + 1;
  }
  return counts;
}

// 4. getSummary()
function getSummary() {
  const total = notes.length;
  const wordNote = total === 1 ? "note" : "notes";
  const counts = countByCategory();

  const categoryParts = Object.entries(counts).map(
    ([category, count]) => `${count} ${category}`
  );

  return `${total} ${wordNote}: ${categoryParts.join(", ")}.`;
}

// 5. isDuplicate(text)
function isDuplicate(text) {
  if (!text) return false;
  const formattedText = text.trim().toLowerCase();
  return notes.some(
    (note) => note.text.trim().toLowerCase() === formattedText
  );
}

// 6. addNote(text, category)
function addNote(text, category) {
  const validCategories = ["personal", "work", "study"];

  if (!text || text.length < 1 || text.length > 200) {
    console.log("Failed: Text must be between 1 and 200 characters.");
    return false;
  }

  if (!validCategories.includes(category)) {
    console.log(`Failed: Category must be one of ${validCategories.join(", ")}.`);
    return false;
  }

  if (isDuplicate(text)) {
    console.log("Failed: Note text already exists.");
    return false;
  }

  const newNote = {
    id: notes.length > 0 ? Math.max(...notes.map((n) => n.id)) + 1 : 1,
    text: text.trim(),
    category: category,
  };

  notes.push(newNote);
  console.log("Success: Note added.");
  return true;
}

// ==========================================
// TESTS & EXPECTED OUTPUTS
// ==========================================

console.log("--- 1. searchNotes ---");
console.log(searchNotes("javascript")); 
// Expected: [{ id: 4, text: "Revise JavaScript arrays", category: "study" }]
console.log(searchNotes("nonexistent")); 
// Expected: []

console.log("\n--- 2. longestNote ---");
console.log(longestNote()); 
// Expected: { id: 3, text: "Email the project report to Grace", category: "work" }

console.log("\n--- 3. countByCategory ---");
console.log(countByCategory()); 
// Expected: { personal: 2, study: 2, work: 1 }

console.log("\n--- 4. getSummary ---");
console.log(getSummary()); 
// Expected: "5 notes: 2 personal, 2 study, 1 work."

console.log("\n--- 5. isDuplicate ---");
console.log(isDuplicate("buy milk and bread")); 
// Expected: true
console.log(isDuplicate("Buy milk")); 
// Expected: false

console.log("\n--- 6. addNote ---");
console.log(addNote("Read a book", "personal")); 
// Expected output log: "Success: Note added."
// Expected return: true

console.log(addNote("Call mum", "personal")); 
// Expected output log: "Failed: Note text already exists."
// Expected return: false

console.log(addNote("Exercise", "fitness")); 
// Expected output log: "Failed: Category must be one of personal, work, study."
// Expected return: false