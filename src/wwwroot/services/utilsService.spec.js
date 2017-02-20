'use strict';

describe('utilsService', () => {

  beforeEach(() => {
    module('dopplerRelay');
  });
  var utilsService;

  beforeEach(() => {
    inject((_utils_) => {
      utilsService = _utils_;

    });
  });

  describe('analyze password complexity', () => {
    it('should return an object with low password strength(less than 8 chars)', () => {
      var pass = "qwerty";
      var objWeak = { strength: 'weak', result: false, position: 2 };
      expect(utilsService.analizePasswordComplexity(pass)).toEqual(jasmine.objectContaining(objWeak));
    });

    it('should return an object with low password strength(more than 8 chars)', () => {
      var pass = "qwertyui";
      var objWeak = { strength: 'weak', result: false, position: 2 };
      expect(utilsService.analizePasswordComplexity(pass)).toEqual(jasmine.objectContaining(objWeak));
    });

    it('should return an object with weak password strength(less than 8 chars)', () => {
      var pass = "Qwerty1";
      var objWeak = { strength: 'weak', result: false, position: 2 };
      expect(utilsService.analizePasswordComplexity(pass)).toEqual(jasmine.objectContaining(objWeak));
    });

    it('should return an object with good password strength', () => {
      var pass = "qwerty12";
      var objWeak = { strength: 'good', result: true, position: 1 };
      expect(utilsService.analizePasswordComplexity(pass)).toEqual(jasmine.objectContaining(objWeak));
    });
    
    it('should return an object with strong password strength', () => {
      var pass = "Qwerty12";
      var objWeak = { strength: 'strong', result: true, position: 2 };
      expect(utilsService.analizePasswordComplexity(pass)).toEqual(jasmine.objectContaining(objWeak));
    });
  });
});
