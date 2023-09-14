import { describe, expect, it } from 'bun:test'
import { isHtml } from '../src'

describe('isHtml', () => {
	it('detects html', () => {
		expect(isHtml('<h1>Hi</h1>')).toBe(true)
		expect(isHtml('<html></html>')).toBe(true)
		expect(isHtml('<!doctype html>')).toBe(true)
		expect(isHtml('<!DOCTYPE html>')).toBe(true)
		expect(isHtml('<html lang="en"></html>')).toBe(true)
		expect(isHtml('<html></html><h1>Hi</h1>')).toBe(true)
		expect(isHtml('<!doctype html><h1>Hi</h1>')).toBe(true)
		expect(isHtml('<!DOCTYPE html><h1>Hi</h1>')).toBe(true)
		expect(isHtml('<html lang="en"><h1>Hi</h1></html>')).toBe(true)

		// Should trim() by default
		expect(isHtml('   <h1>Hi</h1>    ')).toBe(true)
	})

	it('detects html with JSX', () => {
		expect(isHtml(<h1>Hi</h1>)).toBe(true)
		expect(isHtml(<html></html>)).toBe(true)
		expect(isHtml(<html lang="en"></html>)).toBe(true)
		expect(
			isHtml(
				<>
					<html></html>
					<h1>Hi</h1>
				</>
			)
		).toBe(true)
		expect(
			isHtml(
				<html lang="en">
					<h1>Hi</h1>
				</html>
			)
		).toBe(true)
	})

	it('does not detects html on non strings', () => {
		expect(isHtml()).toBe(false)
		expect(isHtml(undefined)).toBe(false)
		expect(isHtml(null)).toBe(false)
		expect(isHtml(0)).toBe(false)
		expect(isHtml(1)).toBe(false)
		expect(isHtml({ a: 1 })).toBe(false)
		expect(isHtml({ html: '<div></div>' })).toBe(false)
		expect(isHtml([])).toBe(false)
		expect(isHtml(true)).toBe(false)
		expect(isHtml(false)).toBe(false)
	})

	it('does not detects html on non html strings', () => {
		expect(isHtml('')).toBe(false)
		expect(isHtml('Hi')).toBe(false)
		expect(isHtml('Hi <h1>Hi</h1>')).toBe(false)
		expect(isHtml('<h1>Hi</h1> Hi')).toBe(false)
		expect(isHtml('<h1> invalid <h1')).toBe(false)
		expect(isHtml('h1> invalid <h1>')).toBe(false)
	})
})
