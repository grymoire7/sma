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
    name: 'Gardening',
    description: 'Refresh your knowledge about plants and gardening techniques',
    path: 'gardening',
    dataFile: 'subject-data-gardening.js'
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
  try {
    let data;
    switch (subjectPath) {
      case 'spanish':
        data = await import('../data/subject-data-spanish.js');
        break;
      case 'roman-empire':
        data = await import('../data/subject-data-roman-empire.js');
        break;
      case 'gardening':
        data = await import('../data/subject-data-gardening.js');
        break;
      case 'trivia':
        data = await import('../data/subject-data-trivia.js');
        break;
      default:
        throw new Error(`Unknown subject: ${subjectPath}`);
    }
    return data.default;
  } catch (error) {
    console.error('Error loading subject data:', error);
    return null;
  }
};
