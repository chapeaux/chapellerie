import { ordinal, bytes, abbrev, percent, enotation, thousands } from './number_fmt.js';


describe("Number format tests", () => {
    describe("Ordinal format", () => {
        it("should add 'st' to 1", () => {
            expect(ordinal`1`).toBe('1st');
        });
        it("should add 'nd' to 2", () => {
            expect(ordinal`2`).toBe('2nd');
        });
        it("should add 'rd' to 3", () => {
            expect(ordinal`3`).toBe('3rd');
        });
        it("should add 'th' to 4", () => {
            expect(ordinal`4`).toBe('4th');
        });
        it("should add 'th' to 11", () => {
            expect(ordinal`11`).toBe('11th');
        });
        it("should add 'th' to 12", () => {
            expect(ordinal`12`).toBe('12th');
        });
        it("should add 'th' to 14548912", () => {
            expect(ordinal`14548912`).toBe('14548912th');
        });
        it("should add 'nd' to 14548922", () => {
            expect(ordinal`14548922`).toBe('14548922nd');
        });
        it("should trim and add 'st' to 1.12", () => {
            expect(ordinal`1.12`).toBe('1st');
        });
        it("should trim and add 'st' to 2.72", () => {
            expect(ordinal`${78}2.72`).toBe('2nd');
        });
    });
    describe("Bytes format", () => {
        it
    });
    // describe("Abbreviation format", () => {

    // });
    // describe("Percent format", () => {

    // });
    // describe("E Notation format", () => {

    // });
    // describe("Thousands format", () => {

    // });
    
})