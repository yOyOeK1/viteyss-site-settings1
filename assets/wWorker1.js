var i = 0;

function timedCount() {
  i = i + 1;
  postMessage(i);
  console.log('ping ',i,' from worker');
  setTimeout("timedCount()",1000);
}

timedCount();