# jsonsocket
Async Dynamic Json Data Socket

This project is to provide a multi-user dynamic JSON data set via a socket.

Goals:
- Server Sourced Synced JSON content via Web Sockets
- Distributed delta change notices keeping clients in sync with data
- Dynamically controlled nodes of data access providing on demand/gated json content in data
- Node/client architecture for scalability
- Independent Reader/Writer control by Server config/developers
- Build in at base, dev controlled security and compression protocols
