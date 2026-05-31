import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db, isFirebaseEnabled } from '../config/firebase';
import { useAuth } from './AuthContext';

const ProgressContext = createContext();

export const useProgress = () => useContext(ProgressContext);

export const ProgressProvider = ({ children }) => {
  const { user } = useAuth();
  const [completedArticles, setCompletedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync progress data
  useEffect(() => {
    // Local-only mode or guest user
    if (!isFirebaseEnabled || !user) {
      const localProgress = JSON.parse(localStorage.getItem('completed_articles') || '[]');
      setCompletedArticles(localProgress);
      setLoading(false);
      return;
    }

    setLoading(true);
    const docRef = doc(db, 'users', user.uid);

    // Initial load and merge local progress once
    const handleLoginAndMerge = async () => {
      const localProgress = JSON.parse(localStorage.getItem('completed_articles') || '[]');
      if (localProgress.length > 0) {
        try {
          const docSnap = await getDoc(docRef);
          let cloudProgress = [];
          if (docSnap.exists()) {
            cloudProgress = docSnap.data().completed || [];
          }
          // Merge local and cloud progress uniquely
          const mergedProgress = Array.from(new Set([...cloudProgress, ...localProgress]));
          await setDoc(docRef, { completed: mergedProgress }, { merge: true });
          
          // Clear local progress since it is now synced to cloud
          localStorage.removeItem('completed_articles');
        } catch (error) {
          console.warn("Failed to merge local progress to cloud:", error);
        }
      }
    };

    handleLoginAndMerge();

    // Establish live listener from Firestore
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setCompletedArticles(docSnap.data().completed || []);
      } else {
        setCompletedArticles([]);
      }
      setLoading(false);
    }, (error) => {
      console.warn("Failed to sync progress from Firestore:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Toggle completion state of an article
  const toggleCompleted = async (articleId) => {
    const isCompleted = completedArticles.includes(articleId);
    const updated = isCompleted
      ? completedArticles.filter(id => id !== articleId)
      : [...completedArticles, articleId];

    setCompletedArticles(updated);

    if (!user || !isFirebaseEnabled) {
      // Offline/local persistence
      localStorage.setItem('completed_articles', JSON.stringify(updated));
    } else {
      // Cloud persistence
      try {
        const docRef = doc(db, 'users', user.uid);
        await setDoc(docRef, { completed: updated }, { merge: true });
      } catch (error) {
        console.error("Failed to save progress to Firestore:", error);
      }
    }
  };

  // Helper to check if an article is completed
  const isArticleCompleted = (articleId) => completedArticles.includes(articleId);

  return (
    <ProgressContext.Provider value={{ completedArticles, loading, toggleCompleted, isArticleCompleted }}>
      {children}
    </ProgressContext.Provider>
  );
};
