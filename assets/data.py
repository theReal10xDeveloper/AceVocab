import sqlite3
import json


def create_database(
    db_name="vocabulary.db", vocab_list_file="vocab_list.json", presets=None
):
    # Connect to SQLite database (or create it if it doesn't exist)
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()

    # Create tables for the vocabulary and presets
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS vocabulary (
            word TEXT PRIMARY KEY,
            correct_count INTEGER DEFAULT 0,
            incorrect_count INTEGER DEFAULT 0
        )
    """
    )

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS presets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL
        )
    """
    )

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS word_preset (
            word TEXT,
            preset_id INTEGER,
            PRIMARY KEY (word, preset_id),
            FOREIGN KEY (word) REFERENCES vocabulary(word),
            FOREIGN KEY (preset_id) REFERENCES presets(id)
        )
    """
    )

    # Read vocabulary list from a JSON file
    with open(vocab_list_file, "r", encoding="utf-8") as file:
        vocab_data = json.load(file)

    # Insert each word into the vocabulary table with initial counts set to 0
    for word in vocab_data.keys():
        cursor.execute("INSERT OR IGNORE INTO vocabulary (word) VALUES (?)", (word,))

    # Insert preset names into the presets table
    if presets:
        for preset in presets:
            cursor.execute("INSERT OR IGNORE INTO presets (name) VALUES (?)", (preset,))

    # Example logic for assigning words to presets (customize as per your dataset)
    example_preset_assignments = {
        "IELTS": ["word1", "word2"],
        "TOEFL": ["word2", "word3"],
        "GRE": ["word1", "word3"],
    }

    for preset_name, words_for_preset in example_preset_assignments.items():
        cursor.execute("SELECT id FROM presets WHERE name = ?", (preset_name,))
        preset_id = cursor.fetchone()[0]

        for word in words_for_preset:
            cursor.execute(
                "INSERT OR IGNORE INTO word_preset (word, preset_id) VALUES (?, ?)",
                (word, preset_id),
            )

    # Commit changes and close the connection
    conn.commit()
    conn.close()


# Example usage
# create_database(presets=["IELTS", "TOEFL", "GRE"])


def update_toefl_word_set(
    db_name="vocabulary.db", toefl_word_list_file="toefl_word_list.txt"
):
    # Connect to SQLite database
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()

    # Ensure the TOEFL preset exists and get its ID
    cursor.execute("INSERT OR IGNORE INTO presets (name) VALUES (?)", ("TOEFL",))
    cursor.execute("SELECT id FROM presets WHERE name = ?", ("TOEFL",))
    toefl_preset_id = cursor.fetchone()[0]

    # Read TOEFL word list from a file
    with open(toefl_word_list_file, "r", encoding="utf-8") as file:
        lines = file.readlines()

    # Process each line in the TOEFL word list
    for line in lines:
        # Extract the word, which is the part before the first '#'
        word = line.split("#")[0].strip()

        # Check if the word exists in the vocabulary table
        cursor.execute("SELECT word FROM vocabulary WHERE word = ?", (word,))
        if cursor.fetchone():
            # If the word exists, add it to the TOEFL word set
            cursor.execute(
                "INSERT OR IGNORE INTO word_preset (word, preset_id) VALUES (?, ?)",
                (word, toefl_preset_id),
            )

    # Commit changes and close the connection
    conn.commit()
    conn.close()


# Example usage
update_toefl_word_set()
