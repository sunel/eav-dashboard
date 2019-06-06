@include('eav-dashboard::mix')
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="theme-color" content="#000000">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Eav Dashboard</title>
    @stack('styles')
    <style>
        .lds-ripple {
          display: inline-block;
          position: relative;
          width: 64px;
          height: 64px;
        }
        .lds-ripple div {
          position: absolute;
          border: 4px solid #9f38ec;
          opacity: 1;
          border-radius: 50%;
          animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
        }
        .lds-ripple div:nth-child(2) {
          animation-delay: -0.5s;
        }
        @keyframes lds-ripple {
          0% {
            top: 28px;
            left: 28px;
            width: 0;
            height: 0;
            opacity: 1;
          }
          100% {
            top: -1px;
            left: -1px;
            width: 58px;
            height: 58px;
            opacity: 0;
          }
        }

        .container {
          align-items: center;
          background-color: white;
          display: flex;
          height: 98vh;
          justify-content: center;
          width: 98vw;
          overflow: hidden;
          border: 3px;
          box-sizing: border-box;
        }        
    </style>
  </head>
  <body>
    <noscript>
      You need to enable JavaScript to run this app.
    </noscript>
    <div id="root">
      <div class="container">
        <div class="lds-ripple"><div></div><div></div></div>
      </div>
    </div>
    @stack('scripts')
  </body>
</html>
