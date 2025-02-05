import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import GPTService from '@/services/GPTservice';
import DatabaseService from '@/services/local_database_service';
import { ThemedText } from '@/components/ThemedText';
import { WordScheduler } from '@/services/WordScheduler';
import SupabaseService, { AnswerType } from '@/services/supabase';

const Content = () => {
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<string>('');
  var db = null;

  useEffect(() => {
    generateQuestion();
  }, []);

  const generateQuestion = async () => {
    setLoading(true);
    console.log("Starting question generation...");

    try {
      // const 
      const words = await WordScheduler.getNextwords();
      // Randomly select a word from the list
      const correctWord = words[0];
      const wrongWords = words.slice(1, 4);
      console.log("Selected correct word:", correctWord);

      // Select additional words for options
      console.log("Generated options:", wrongWords);
      const response = await GPTService.generateFillSentence(correctWord)
      console.log("Generated sentence:", response);

      // Replace word with blank and update state
      setQuestion(response.replace(correctWord, '____'));
      setOptions(words);
      setCorrectAnswer(correctWord);
    } catch (error) {
      console.error("Error during question generation:", error);
      Alert.alert('Error', 'Failed to generate question. Please try again.');
    } finally {
      setLoading(false);
      console.log("Finished question generation.");
    }
  };



  const handleAnswer = (selectedOption : string) => {
    if (selectedOption === correctAnswer) {
      Alert.alert('Correct!', 'You selected the right answer.');
      SupabaseService.updateUserWord(correctAnswer, AnswerType.Correct);
      //update other words
      
    } else {
      Alert.alert('Incorrect', `The correct answer was ${correctAnswer}.`);
      SupabaseService.updateUserWord(correctAnswer, AnswerType.Wrong);
      
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
