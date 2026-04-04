'use client';

import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'ai-nav-favorites';

export interface Favorites {
  tools: string[];
  skills: string[];
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorites>({ tools: [], skills: [] });
  const [isLoaded, setIsLoaded] = useState(false);

  // 从 localStorage 加载
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load favorites:', e);
    }
    setIsLoaded(true);
  }, []);

  // 保存到 localStorage
  const saveFavorites = useCallback((newFavorites: Favorites) => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (e) {
      console.error('Failed to save favorites:', e);
    }
  }, []);

  // 切换工具收藏
  const toggleToolFavorite = useCallback((toolId: string) => {
    const newTools = favorites.tools.includes(toolId)
      ? favorites.tools.filter(id => id !== toolId)
      : [...favorites.tools, toolId];
    saveFavorites({ ...favorites, tools: newTools });
  }, [favorites, saveFavorites]);

  // 切换技能收藏
  const toggleSkillFavorite = useCallback((skillId: string) => {
    const newSkills = favorites.skills.includes(skillId)
      ? favorites.skills.filter(id => id !== skillId)
      : [...favorites.skills, skillId];
    saveFavorites({ ...favorites, skills: newSkills });
  }, [favorites, saveFavorites]);

  // 检查是否收藏
  const isToolFavorite = useCallback((toolId: string) => {
    return favorites.tools.includes(toolId);
  }, [favorites.tools]);

  const isSkillFavorite = useCallback((skillId: string) => {
    return favorites.skills.includes(skillId);
  }, [favorites.skills]);

  return {
    favorites,
    isLoaded,
    toggleToolFavorite,
    toggleSkillFavorite,
    isToolFavorite,
    isSkillFavorite,
  };
}