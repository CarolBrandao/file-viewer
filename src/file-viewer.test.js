import * as R from 'ramda'
import { getTree, getEditedArray, getArrayAfterDeletion } from './file-viewer'

describe('getTree', () => {
  it('get tree from string array', () => {
    // arrange
    const array = ['a/b/c','a/b', 'a/c']

    const expectedTree = {
    	a: {
    		b: {
    			c: {}
    		},
    		c: {}
    	}
    }

    //act
    const tree = getTree(array)

    // assert
    expect(tree).toEqual(expectedTree)
  })
})

describe('getArrayAfterDeletion', () => {
  it('item to be deleted is a single file', () => {
    // arrange
    const array = ['a/b/c','a/b', 'a/c']
    const element = 'a/b/c'

    //act
    const newArray = getArrayAfterDeletion(element, array)

    // assert
    expect(newArray).toEqual(['a/b', 'a/c'])
  })

  it('item to be deleted is a folder', () => {
    // arrange
    const array = ['a/b/c','a/b/c/a/b', 'a/c', 'd/a/b/c']
    const element = 'a/b'

    //act
    const newArray = getArrayAfterDeletion(element, array)

    // assert
    expect(newArray).toEqual(['a/c','d/a/b/c'])
  })
})

describe('getEditedArray', () => {
  it('item to be idited is a single file', () => {
    // arrange
    const array = ['a/b/c','a/b', 'a/c']
    const element = 'a/b/c'
    const newPath = 'a/b/test'

    //act
    const newArray = getEditedArray(element, newPath, array)

    // assert
    expect(newArray).toEqual(['a/b', 'a/c', 'a/b/test'])
  })

  it('item to be edited is a folder', () => {
    // arrange
    const array = ['a/b/c','a/b/c/a/b', 'a/c', 'd/a/b/c']
    const element = 'a/b'
    const newPath = 'a/test'

    //act
    const newArray = getEditedArray(element, newPath, array)

    // assert
    expect(newArray).toEqual(['a/test/c','a/test/c/a/b', 'a/c', 'd/a/b/c'])
  })
})