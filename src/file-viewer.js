import React from 'react'
import * as R from 'ramda'
import TreeView from '@material-ui/lab/TreeView'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import TreeItem from '@material-ui/lab/TreeItem'
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu"

//Initial state of array of paths
//The file viwer will render with these files

const initialState = [
  "marvel/black_widow/bw.png",
  "marvel/drdoom/the-doctor.png",
  "fact_marvel_beats_dc.txt",
  "dc/aquaman/mmmmmomoa.png",
  "marvel/black_widow/why-the-widow-is-awesome.txt",
  "dc/aquaman/movie-review-collection.txt",
  "marvel/marvel_logo.png",
  "dc/character_list.txt"
]

//get tree from array of strings
export function getTree(data){
  var result = {}
    
  data.forEach(p => p.split('/').reduce((o, k) => o[k] = o[k] || {}, result));
  return result
}

//Iterate tree to render nodes
function getChildren(tree, fullPath){
  var children = []
 for (var k in tree){

    const path = `${fullPath}${k}`
    R.isEmpty(tree[k]) ? (
      children.push(<ContextMenuTrigger key={`${path}-menu`} id="mainmenu"> 
                      <TreeItem key={path} nodeId={path} id={path} label={k} />
                    </ContextMenuTrigger>
      )
    ):(
      children.push(<ContextMenuTrigger key={`${path}-menu`} id="mainmenu">
                      <TreeItem key={path} nodeId={path}  id={path} label={k}>
                        {getChildren(tree[k], `${path}/`)}
                      </TreeItem>
                    </ContextMenuTrigger>)
    )
  }
  return children 
}

//render input type text and submit button in order to add a new node in the tree
function AddNode(props){
  let input
  return(
    <form onSubmit={e => {
      e.preventDefault()
      if (!input.value.trim()) {
        return
      }
      props.onSubmit(R.append(input.value), props.array)
      input.value = ''
    }}>
      <input type="text" ref={node => input = node} />
      <button type="submit">
        Add Node
      </button>
    </form>
  )
}

export function getEditedArray(element, newPath, pathArray){
  return R.includes(element, pathArray)
    ?  R.pipe(
        R.without([element]),
        R.append(newPath)
      )(pathArray)
    : R.map(el => R.replace(new RegExp(`^${element}/`), `${newPath}/`, el), pathArray)
}

export function getArrayAfterDeletion(element, pathArray){
  return R.includes(element, pathArray)
    ? R.without([element], pathArray) 
    : R.reject( path => R.contains(`${element}/`,path), pathArray)
}

//handle right button menu click
function handleClick(data, pathArray, setPathArray) {
  const element = data.target.parentElement.parentElement.id
  let newArray
  if(data.action === 'delete'){
    newArray = getArrayAfterDeletion(element, pathArray)
    setPathArray(newArray)
  }else if(data.action === 'edit'){
    const newPath= prompt("New node name:", element)

    if (newPath !== null && newPath !== "") {
      newArray = getEditedArray(element, newPath, pathArray)
    }
  }
  setPathArray(newArray || pathArray)
}

//file viewer component
export default function FileViewer() {
  const [pathArray, setPathArray] = React.useState(initialState)

  const tree = getTree(pathArray)
  return (
    <React.Fragment>
     <AddNode array={pathArray} onSubmit={setPathArray} /> 
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        {
          getChildren(tree, '')
        }
      </TreeView>
      {/*Menu jsx*/}
       <ContextMenu id="mainmenu">
        <MenuItem 
          data={{action: 'delete'}} 
          onClick={(e, data) => handleClick(data, pathArray, setPathArray)}
        >
          Delete
        </MenuItem>
        <MenuItem 
          data={{action: 'edit'}} 
          onClick={(e, data) => handleClick(data, pathArray, setPathArray)}
        >
          Edit
        </MenuItem>
      </ContextMenu>
    </React.Fragment>
  )
}