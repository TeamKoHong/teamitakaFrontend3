// Minimal react-router-dom mock for Jest tests
const mockNavigate = jest.fn();

module.exports = {
  useNavigate: () => mockNavigate,
};

module.exports.__mockNavigate = mockNavigate;


