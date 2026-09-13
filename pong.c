// PONG — the entire game is ~30 KB. The other 9.99999 GB of the file is nothing. (Windows ignores bytes after the program.)
#include <windows.h>
#include <stdio.h>
static int W=800,H=500; static float px=10,py=200,ex=780,ey=200,bx=400,by=250,vx=5,vy=3; static int ph=90,eh=90,pw=12,bs=12,sp=0,se=0,paused=0;
static void reset(int dir){ bx=W/2; by=H/2; vx=5*dir; vy=(rand()%7-3)||2; }
static void step(HWND h){ if(paused) return; if(GetAsyncKeyState('W')&0x8000||GetAsyncKeyState(VK_UP)&0x8000) py-=7; if(GetAsyncKeyState('S')&0x8000||GetAsyncKeyState(VK_DOWN)&0x8000) py+=7; if(py<0)py=0; if(py>H-ph)py=H-ph;
  float t=by-eh/2; ey+=(t-ey)*0.11f; if(ey<0)ey=0; if(ey>H-eh)ey=H-eh; bx+=vx; by+=vy; if(by<0||by>H-bs) vy=-vy;
  if(bx<px+pw&&by+bs>py&&by<py+ph&&vx<0){ vx=-vx*1.05f; vy+=((by+bs/2)-(py+ph/2))*0.15f; bx=px+pw; }
  if(bx+bs>ex&&by+bs>ey&&by<ey+eh&&vx>0){ vx=-vx*1.05f; vy+=((by+bs/2)-(ey+eh/2))*0.15f; bx=ex-bs; }
  if(bx<-20){ se++; reset(1); } if(bx>W+20){ sp++; reset(-1); } InvalidateRect(h,NULL,FALSE); }
static void paint(HWND h){ PAINTSTRUCT ps; HDC dc=BeginPaint(h,&ps); RECT r; GetClientRect(h,&r); W=r.right; H=r.bottom; ex=W-22;
  HDC m=CreateCompatibleDC(dc); HBITMAP bm=CreateCompatibleBitmap(dc,W,H); SelectObject(m,bm); FillRect(m,&r,(HBRUSH)GetStockObject(BLACK_BRUSH));
  HBRUSH wb=(HBRUSH)GetStockObject(WHITE_BRUSH); for(int y=0;y<H;y+=24){ RECT d={W/2-2,y,W/2+2,y+12}; FillRect(m,&d,wb); }
  RECT a={(int)px,(int)py,(int)px+pw,(int)py+ph}, b={(int)ex,(int)ey,(int)ex+pw,(int)ey+eh}, c={(int)bx,(int)by,(int)bx+bs,(int)by+bs}; FillRect(m,&a,wb); FillRect(m,&b,wb); FillRect(m,&c,wb);
  SetBkMode(m,TRANSPARENT); SetTextColor(m,RGB(255,255,255)); HFONT f=CreateFontA(48,0,0,0,FW_BOLD,0,0,0,0,0,0,0,0,"Consolas"); SelectObject(m,f); char s[64]; sprintf(s,"%d",sp); TextOutA(m,W/2-70,20,s,(int)strlen(s)); sprintf(s,"%d",se); TextOutA(m,W/2+40,20,s,(int)strlen(s)); DeleteObject(f);
  f=CreateFontA(16,0,0,0,FW_NORMAL,0,0,0,0,0,0,0,0,"Consolas"); SelectObject(m,f); const char*t=paused?"PAUSED — space to resume":"W/S or arrows · space pauses · this file is 10 GB and 99.9997% of it is nothing"; TextOutA(m,12,H-24,t,(int)strlen(t)); DeleteObject(f);
  BitBlt(dc,0,0,W,H,m,0,0,SRCCOPY); DeleteObject(bm); DeleteDC(m); EndPaint(h,&ps); }
static LRESULT CALLBACK wp(HWND h,UINT u,WPARAM w,LPARAM l){ switch(u){ case WM_TIMER: step(h); return 0; case WM_PAINT: paint(h); return 0; case WM_KEYDOWN: if(w==VK_SPACE) paused=!paused; if(w==VK_ESCAPE) PostQuitMessage(0); return 0; case WM_ERASEBKGND: return 1; case WM_DESTROY: PostQuitMessage(0); return 0; } return DefWindowProcA(h,u,w,l); }
int WINAPI WinMain(HINSTANCE hi,HINSTANCE hp,LPSTR cmd,int show){ WNDCLASSA wc={0}; wc.lpfnWndProc=wp; wc.hInstance=hi; wc.lpszClassName="BiggestPong"; wc.hCursor=LoadCursor(NULL,IDC_ARROW); RegisterClassA(&wc);
  RECT r={0,0,W,H}; AdjustWindowRect(&r,WS_OVERLAPPEDWINDOW,FALSE); HWND h=CreateWindowA("BiggestPong","Biggest file I've ever made — PONG",WS_OVERLAPPEDWINDOW,CW_USEDEFAULT,CW_USEDEFAULT,r.right-r.left,r.bottom-r.top,NULL,NULL,hi,NULL);
  ShowWindow(h,show); srand(GetTickCount()); reset(1); SetTimer(h,1,16,NULL); MSG m; while(GetMessageA(&m,NULL,0,0)){ TranslateMessage(&m); DispatchMessageA(&m); } return 0; }
