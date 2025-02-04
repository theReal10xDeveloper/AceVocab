import sqlite3
import json

# Your JSON data as a Python dictionary
data = json.load(
    open("/Users/ctk/Documents/AceVocab/assets/vocab_list.json", "r", encoding="utf-8")
)

# Create a SQLite database and establish a connection
conn = sqlite3.connect("words.db")
cursor = conn.cursor()

# Create a table to store the words and their unique IDs
cursor.execute(
    """
    CREATE TABLE IF NOT EXISTS words (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        word TEXT UNIQUE
    )
"""
)

# Insert words into the table
for word in data.keys():
    cursor.execute("INSERT INTO words (word) VALUES (?)", (word,))

# Commit the transaction
conn.commit()

# Close the connection
conn.close()

print("SQLite database 'words.db' created with unique IDs for each word.")
