import './polyfills.server.mjs';
import{q as e}from"./chunk-KAWMVTNE.mjs";function s(r,t="Something went wrong"){if(!(r instanceof e))return t;if(r.status===0)return"The API could not be reached";let n=r.error?.message;return Array.isArray(n)?n.join(", "):typeof n=="string"?n:t}export{s as a};
