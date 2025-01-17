import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import GPTService from '@/services/GPTservice';
import DatabaseService from '@/services/local_database_service';
import { ThemedText } from '@/components/ThemedText';

const Content = () => {
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState([]);
  var db = null;

  useEffect(() => {
    generateQuestion();
  }, []);

  const generateQuestion = async () => {
    setLoading(true);
    console.log("Starting question generation...");

    try {
      const toeflWords: String[] = await DatabaseService.fetchToeflWords();
      console.log("Fetched TOEFL words:", toeflWords);

      if (toeflWords.length === 0) {
        throw new Error('No words found in the TOEFL preset.');
      }

      // Randomly select a word from the list
      const correctWord = toeflWords[Math.floor(Math.random() * toeflWords.length)];
      console.log("Selected correct word:", correctWord);

      // Select additional words for options
      const optionsSet = new Set();
      optionsSet.add(correctWord);

      while (optionsSet.size < 4) {
        const randomWord = toeflWords[Math.floor(Math.random() * toeflWords.length)];
        optionsSet.add(randomWord);
      }

      const shuffledOptions = Array.from(optionsSet).sort(() => Math.random() - 0.5);
      console.log("Generated options:", shuffledOptions);
      const response = await GPTService.generateFillSentence(correctWord)
      console.log("Generated sentence:", response);

      // Replace word with blank and update state
      setQuestion(response.replace(correctWord, '____'));
      setOptions(shuffledOptions);
      setCorrectAnswer(correctWord);
    } catch (error) {
      console.error("Error during question generation:", error);
      Alert.alert('Error', 'Failed to generate question. Please try again.');
    } finally {
      setLoading(false);
      console.log("Finished question generation.");
    }
  };



  const handleAnswer = (selectedOption : any) => {
    if (selectedOption === correctAnswer) {
      Alert.alert('Correct!', 'You selected the right answer.');
    } else {
      Alert.alert('Incorrect', `The correct answer was ${correctAnswer}.`);
    }
    generateQuestion();
  };

  return (
    
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <ThemedText style={{ fontSize: 18, marginBottom: 20 }}>{question}</ThemedText>
            <ThemedText style={{ fontSize: 16, marginBottom: 20 }}>Select the correct answer:</ThemedText>
            {options.map((option, index) => (
              <Button key={index} title={option} onPress={() => handleAnswer(option)} />
            ))}
          </>
        )}
      </View>
    
  );
}


export default function PracticeView() {
  return (
    <Content />
  );
}
