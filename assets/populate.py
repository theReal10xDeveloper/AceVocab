import sqlite3
import math

# Connect to the SQLite database
conn = sqlite3.connect("vocabulary.db")
cursor = conn.cursor()


# Function to update the seen_count, correct_count, and incorrect_count
def update_word_counts(word, correct, incorrect, seen):
    cursor.execute(
        """
        UPDATE vocabulary
        SET correct_count = correct_count + ?,
            incorrect_count = incorrect_count + ?,
            seen_count = seen_count + ?
        WHERE word = ?
    """,
        (correct, incorrect, seen, word),
    )
    conn.commit()


# Function to calculate memory retention using Ebbinghaus forgetting curve
def calculate_retention(time, strength):
    return math.exp(-time / strength)


# Example usage
word = "example_word"
correct = 1
incorrect = 0
seen = 1
time = 5  # Time since last review in arbitrary units
strength = 2  # Relative strength of memory

# Update word counts
update_word_counts(word, correct, incorrect, seen)

# Calculate retention
retention = calculate_retention(time, strength)
print(f"Memory retention for {word}: {retention}")

# Close the connection
conn.close()
