import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

/**
 * Basic unit test to confirm the App component renders the hero title.
 * This checks that the search screen appears correctly on initial load.
 */
test('renders explore github profiles title', () => {
  // Render the component into the virtual DOM
  render(<App />);
  
  // Locate the header text on the screen (case insensitive search)
  const titleElement = screen.getByText(/Explore GitHub Profiles/i);
  
  // Assert that the text element is successfully rendered in the document
  expect(titleElement).toBeInTheDocument();
});

