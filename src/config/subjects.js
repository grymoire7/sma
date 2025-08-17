export const subjects = [
  {
    name: 'Spanish',
    description: 'Test your Spanish vocabulary and grammar skills',
    path: 'spanish',
    dataFile: 'subject-data-spanish.js'
  },
  {
    name: 'Roman Empire',
    description: 'Explore the history and culture of ancient Rome',
    path: 'roman-empire',
    dataFile: 'subject-data-roman-empire.js'
  },
  {
    name: 'Trivia',
    description: 'General knowledge questions across various topics',
    path: 'trivia',
    dataFile: 'subject-data-trivia.js'
  }
];

// Helper function to get subject by path
export const getSubjectByPath = (path) => {
  return subjects.find(subject => subject.path === path);
};

// Helper function to load subject data dynamically
export const loadSubjectData = async (subjectPath) => {
  const subject = getSubjectByPath(subjectPath);
  if (!subject) {
    throw new Error(`Unknown subject: ${subjectPath}`);
  }
  
  try {
    const data = await import(`../data/${subject.dataFile}` /* @vite-ignore */);
    return data.default;
  } catch (error) {
    console.error('Error loading subject data:', error);
    return null;
  }
};
