'use strict';

describe('authService', () => {

  beforeEach(() => {
    // Ugly patch, localStorage should be cleaned before initialize module
    localStorage.clear();
    module('dopplerRelay');
  });
  var authService;

  beforeEach(() => {
    inject((_auth_) => {
      authService = _auth_;
    });
  });


  describe('authTokenTest', () => {
    it('should return null at the start', () => {
      expect(authService.isAuthed()).toBe(false);
    });

    it('should not return null after save token', () => {
      var token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0ODM2MjQ3NjAsImV4cCI6MTQ4NjIxNjc2MCwiaWF0IjoxNDgzNjI0NzYwLCJpc3MiOiJodHRwOi8vZG9wcGxlcnJlbGF5aW50Lm1ha2luZ3NlbnNlLmNvbTo4MDgwIiwic3ViIjo3MDAwMiwidW5pcXVlX25hbWUiOiJ1c2VybmFtZTJAZG9wcGxlcnJlbGF5LmNvbSIsInJlbGF5X2FjY291bnRzIjpbImFjY291bnQyIl0sInJlbGF5X3Rva2VuX3ZlcnNpb24iOiIxLjAuMC1iZXRhNSJ9.Ee2eb88xqZpkLUoX2AET2_SiDodzxCltFxaIVpJQ4DXtteXpt_1eB5WjEcV4t0KryrWLw4M0Yc_xRaXWYsXFMCBPwy53qpMzeNg39rEK70cYdlvNV_mLQz9Q0fesxYQPjWeNelg1GGrbiYtx5ljiLZStav-rouoHeye5uu9tAFVc8NVNIjmwuy87aWmH0oeuccNszrKjYndACno_K7Wna5JOQpXLsR6VZhcTeyUAaXvfGlhRPtZ2QQYrxW1APfXNCAcwtK8R07qoIKACvY-opH6xXdSl1fuhHDWzpeq7xWsiJswgtiCHkNiXOItOA5z-OQqnutQcZ4ReLuxuczhn7g";
      authService.saveToken(token);
      expect(authService.isAuthed()).toBe(true);
    });

  });
});
