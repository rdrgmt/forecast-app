export const apiKey = "933151a3a6b3745dcd99ff7f8df5c640"

export const searchCache = await caches.open('search-cache');
export const weatherCache = await caches.open('weather-cache');

export const searchButton = document.getElementById('search-button');
export const searchInput = document.getElementById('search-bar') as HTMLInputElement;

export const container = document.getElementById('popup');
export const content = document.getElementById('popup-content');