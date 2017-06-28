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

  describe('analyze credit card numbers', () => {
    it('should return true when the credit card number is a valid Visa format type', () => {
      var visa1 = "4929410783961197";
      var visa2 = "4337222585191725";
      expect(utilsService.validateCreditCard(visa1)).toBe(true);
      expect(utilsService.validateCreditCard(visa2)).toBe(true);
    });
    it('should return true when the credit card number is a valid MasterCard format type', () => {
      var masterCard1 = "5581523930611337";
      var masterCard2 = "5534387826082385";
      expect(utilsService.validateCreditCard(masterCard1)).toBe(true);
      expect(utilsService.validateCreditCard(masterCard2)).toBe(true);
    });
    it('should return true when the credit card number is a valid Amex format type', () => {
      var amex1 = "371678040965927";
      var amex2 = "370274579282875";
      var amex3 = "373436070140970";
      expect(utilsService.validateCreditCard(amex1)).toBe(true);
      expect(utilsService.validateCreditCard(amex2)).toBe(true);
      expect(utilsService.validateCreditCard(amex3)).toBe(true);
    });
    it('should return true when the credit card number is a Diners format type(works as Mastercard currently)', () => {
      var diners1 = "5490728319582476";
      var diners2 = "5408298971833352";
      var diners3 = "5415403281378053";
      expect(utilsService.validateCreditCard(diners1)).toBe(true);
      expect(utilsService.validateCreditCard(diners2)).toBe(true);
      expect(utilsService.validateCreditCard(diners3)).toBe(true);
    });
    it('should return false when the credit card number is not a valid format type', () => {
      var invalid1 = "49294107839611974";
      var invalid2 = "433722258519172";
      var invalid3 = "45081657214027661";
      var invalid4 = "45087807312924765";
      var invalid5 = "558152393061133";
      var invalid6 = "55343878260823855";
      var invalid7 = "3716780409659271";
      var invalid8 = "37027457928287";
      var invalid9 = "273436070140970";
      var invalid10 = "2929410783961197";
      var invalid11 = "3508780731292476";
      var invalid12 = "5634387826082385";
      var invalid13 = "383436070140970";

      expect(utilsService.validateCreditCard(invalid1)).toBe(false);
      expect(utilsService.validateCreditCard(invalid2)).toBe(false);
      expect(utilsService.validateCreditCard(invalid3)).toBe(false);
      expect(utilsService.validateCreditCard(invalid4)).toBe(false);
      expect(utilsService.validateCreditCard(invalid5)).toBe(false);
      expect(utilsService.validateCreditCard(invalid6)).toBe(false);
      expect(utilsService.validateCreditCard(invalid7)).toBe(false);
      expect(utilsService.validateCreditCard(invalid8)).toBe(false);
      expect(utilsService.validateCreditCard(invalid9)).toBe(false);
      expect(utilsService.validateCreditCard(invalid10)).toBe(false);
      expect(utilsService.validateCreditCard(invalid11)).toBe(false);
      expect(utilsService.validateCreditCard(invalid12)).toBe(false);
      expect(utilsService.validateCreditCard(invalid13)).toBe(false);
    });
  });
});
