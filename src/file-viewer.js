import React from 'react'
import * as R from 'ramda'
import { makeStyles } from '@material-ui/core/styles'
import TreeView from '@material-ui/lab/TreeView'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import TreeItem from '@material-ui/lab/TreeItem'

const useStyles = makeStyles({
  root: {
    height: 216,
    flexGrow: 1,
    maxWidth: 400,
  },
})

//Initial state of array of paths

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
function getTree(data){
  var result = {}
    
  data.forEach(p => p.split('/').reduce((o, k) => o[k] = o[k] || {}, result));
  return result
}

//Iterate tree to render nodes
function getChildren(tree){
  var children = []
 for (var k in tree)
  {
    R.isEmpty(tree[k]) ? (
      children.push(<TreeItem key={k} nodeId={k} label={k} />)
    ):(
      children.push(<TreeItem key={k} nodeId={k} label={k} >
        {getChildren(tree[k])}
      </TreeItem>)
    )
  }
  return children 
}

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

export default function FileViewer() {
  const classes = useStyles();
  const [pathArray, setPathArray] = React.useState(initialState)

  const tree = getTree(pathArray)

  return (
    <React.Fragment>
     <AddNode array={pathArray} onSubmit={setPathArray} />
      <TreeView
        className={classes.root}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        {
          getChildren(tree)
        }
      </TreeView>
     
    </React.Fragment>
  )
}