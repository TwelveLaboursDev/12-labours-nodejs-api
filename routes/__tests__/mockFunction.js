const generateMockData = (length) => {
  let mockData = [];
  for (let i = 0; i < length; i++) {
    mockData.push({
      value: i + 1,
      display: `${Math.random().toString(36).substring(2, 11)}`,
    });
  }
  return mockData;
};

module.exports = generateMockData;
