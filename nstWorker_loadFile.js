self.onmessage = async function(event) {
    //console.log('Message from main thread:', event.data);


    if( typeof event.data != 'string' && 'action' in event.data ){

        if( event.data.action == 'openFile' ){        
            //console.log('worker open file :)',event.data);

            const reader = new FileReader();
            reader.onload = (e) => {
                const fileContent = e.target.result;
                //console.log(fileContent);
                self.postMessage({
                    'status':'ok', 'org': event.data, 'res': fileContent
                });
            };
            reader.onerror = (error) => {
                console.error('Error reading file:', error);
                self.postMessage({
                    'status':'error', 'org': event.data, 'res': error
                });
            };


            if( !( 'resAs' in event.data ) || event.data.resAs == 'text' )
                reader.readAsText( event.data.fh );
            else if( event.data.resAs == 'b64' )
                reader.readAsDataURL( event.data.fh );            


        }

    }else if( event.data == 'echo' )
        self.postMessage('echo date :'+Date.now());
 

    //self.postMessage('Hello from the worker!');
};