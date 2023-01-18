import type { Atom } from 'jotai'
import type { SetStateAction } from 'react'

import type { JsonViewerProps, Path } from '..'
import {
  collapseStringsAfterLengthAtom,
  defaultInspectDepthAtom,
  displayDataTypesAtom,
  displayObjectSizeAtom,
  editableAtom,
  enableClipboardAtom,
  groupArraysAfterLengthAtom,
  indentWidthAtom,
  keyRendererAtom,
  maxDisplayLengthAtom,
  objectSortKeysAtom,
  onChangeAtom,
  onCopyAtom,
  quotesOnKeysAtom,
  rootNameAtom,
  valueAtom
} from '../state'
import type { JsonViewerKeyRenderer, JsonViewerState } from '../type'

export { Provider as JsonViewerProvider } from 'jotai'

const DefaultKeyRenderer: JsonViewerKeyRenderer = () => null
DefaultKeyRenderer.when = () => false

/* TODO remove */
export type JsonViewerActions = {
  getInspectCache: (path: Path, nestedIndex?: number) => boolean
  setInspectCache: (
    path: Path, action: SetStateAction<boolean>, nestedIndex?: number) => void
  setHover: (path: Path | null, nestedIndex?: number) => void
}

export const createJsonViewerStore = <T = unknown> ({
  collapseStringsAfterLength,
  defaultInspectDepth,
  displayDataTypes,
  displayObjectSize,
  editable,
  enableClipboard,
  groupArraysAfterLength,
  indentWidth,
  keyRenderer,
  maxDisplayLength,
  objectSortKeys,
  onChange,
  onCopy,
  quotesOnKeys,
  rootName,
  value
}: JsonViewerProps<T>): Array<[Atom<JsonViewerState[keyof JsonViewerState]>, JsonViewerState[keyof JsonViewerState]]> => {
  const store = [[valueAtom, value]]
  // provided by user
  if (collapseStringsAfterLength !== undefined) {
    store.push([collapseStringsAfterLengthAtom,
      (collapseStringsAfterLength === false)
        ? Number.MAX_VALUE
        : collapseStringsAfterLength
    ])
  }
  if (defaultInspectDepth !== undefined) store.push([defaultInspectDepthAtom, defaultInspectDepth])
  if (displayDataTypes !== undefined) store.push([displayDataTypesAtom, displayDataTypes])
  if (displayObjectSize !== undefined) store.push([displayObjectSizeAtom, displayObjectSize])
  if (editable !== undefined) store.push([editableAtom, editable])
  if (enableClipboard !== undefined) store.push([enableClipboardAtom, enableClipboard])
  if (groupArraysAfterLength !== undefined) store.push([groupArraysAfterLengthAtom, groupArraysAfterLength])
  if (indentWidth !== undefined) store.push([indentWidthAtom, indentWidth])
  if (keyRenderer !== undefined) store.push([keyRendererAtom, keyRenderer])
  if (maxDisplayLength !== undefined) store.push([maxDisplayLengthAtom, maxDisplayLength])
  if (objectSortKeys !== undefined) store.push([objectSortKeysAtom, objectSortKeys])
  if (onChange !== undefined) store.push([onChangeAtom, onChange])
  if (onCopy !== undefined) store.push([onCopyAtom, onCopy])
  if (rootName !== undefined) store.push([rootNameAtom, rootName])
  if (quotesOnKeys !== undefined) store.push([quotesOnKeysAtom, quotesOnKeys])
  if (rootName !== undefined) store.push([rootNameAtom, rootName])
  return store
}
export type JsonViewerStore = ReturnType<typeof createJsonViewerStore>
