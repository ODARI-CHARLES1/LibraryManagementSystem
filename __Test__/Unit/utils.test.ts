import hashPassword from '../../src/Utils/hashPassword.utils';
import { validateEmail } from '../../src/Utils/validateEmail.utils';
import getDate from '../../src/Utils/generateDate.utils';
import generateDueDate from '../../src/Utils/generateDueDate.utils';

describe('Utility Functions', () => {
  describe('hashPassword', () => {
    test('should hash a password successfully', async () => {
      const password = 'testPassword123';
      const hashed = await hashPassword(password);

      expect(hashed).toBeDefined();
      expect(typeof hashed).toBe('string');
      expect(hashed.length).toBeGreaterThan(0);
      expect(hashed).not.toBe(password);
    });

    test('should produce different hashes for same password', async () => {
      const password = 'testPassword123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('validateEmail', () => {
    test('should return true for valid emails', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'email+tag@example.org',
        'first.last@sub.domain.com'
      ];

      validEmails.forEach(email => {
        expect(validateEmail(email)).toBe(true);
      });
    });

    test('should return false for invalid emails', () => {
      const invalidEmails = [
        'plainaddress',
        '@missingusername.com',
        'email@.com',
        'email@domain',
        'email@domain..com',
        'email@-domain.com',
        'email@domain.com-',
        'email@domain.c',
        'email@domain..com'
      ];

      invalidEmails.forEach(email => {
        expect(validateEmail(email)).toBe(false);
      });
    });
  });

  describe('getDate', () => {
    test('should return current date in ISO format', async () => {
      const date = await getDate();
      const parsedDate = new Date(date);

      expect(date).toBeDefined();
      expect(typeof date).toBe('string');
      expect(parsedDate).toBeInstanceOf(Date);
      expect(isNaN(parsedDate.getTime())).toBe(false);
    });
  });

  describe('generateDueDate', () => {
    test('should return a date string 14 days in the future', async () => {
      const dueDateString = await generateDueDate();

      expect(dueDateString).toBeDefined();
      expect(typeof dueDateString).toBe('string');

      // Parse the date string to verify it's a valid date
      const dueDate = new Date(dueDateString);
      expect(dueDate).toBeInstanceOf(Date);
      expect(isNaN(dueDate.getTime())).toBe(false);

      // Calculate expected due date (14 days from now)
      const expectedDueDate = new Date();
      expectedDueDate.setDate(expectedDueDate.getDate() + 14);

      // Check if the due date is approximately 14 days from now (allowing for small timing differences)
      const timeDiff = Math.abs(dueDate.getTime() - expectedDueDate.getTime());
      expect(timeDiff).toBeLessThan(1000); // Less than 1 second difference
    });
  });
});