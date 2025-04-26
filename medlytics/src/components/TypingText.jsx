import React, { useState, useEffect } from "react";

const TypingText = () => {
  const words = ["Health", "Wellness", "Care", "Nutrition", "Fitness", "Happiness"];
  const [currentWord, setCurrentWord] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const type = () => {
      const current = wordIndex % words.length;
      const fullWord = words[current];

      if (isDeleting) {
        // Delete characters
        setCurrentWord(fullWord.substring(0, currentWord.length - 1));
        setTypingSpeed(100);
      } else {
        // Add characters
        setCurrentWord(fullWord.substring(0, currentWord.length + 1));
        setTypingSpeed(150);
      }

      if (!isDeleting && currentWord === fullWord) {
        // Pause before deleting
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && currentWord === "") {
        // Move to the next word
        setIsDeleting(false);
        setWordIndex((prev) => prev + 1);
        setTypingSpeed(150);
      }
    };

    const timer = setTimeout(type, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentWord, isDeleting, wordIndex, typingSpeed, words]);

  return (
    <div className="typing-text">
      <h1>Empowering {currentWord}</h1>
    </div>
  );
};

export default TypingText;