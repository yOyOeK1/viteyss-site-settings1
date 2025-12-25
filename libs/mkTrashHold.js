/** to make nice throttling on not decided client :P  */
function mkTrashHold( keyIdent, func, msTrash ){
  let t = Date.now();
  console.log(`mkTH spon \n\tkeyIdent[${keyIdent}], func, msTrash[${msTrash}]`);

  if( !('trashH' in window) ){
    window['trashH'] = {
      entryDate: t,
      items: {}
    };
  }

  if( keyIdent in window['trashH']['items'] ){
    let item = window['trashH']['items'][ keyIdent ];
    clearTimeout( item.iter );
    item.tEvents.push( t );
    item.iter = setTimeout(()=> {
      console.log(`mkTrashHold ok for keyIdent: [${item.keyIdent}] events:(${item.tEvents.length})`);
      func(); 
      delete window['trashH']['items'][ keyIdent ];
    }, msTrash );
    return 2;

  }



  window['trashH']['items'][ keyIdent ] = {
    'keyIdent': keyIdent,
    'func': func,
    'tStart': t,
    'tEvents': [],
    'msTrash': msTrash,
    'iter': setTimeout(()=>func() , msTrash )
  };

  return 1;
}

export { mkTrashHold }