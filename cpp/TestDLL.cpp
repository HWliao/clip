#include <iostream>  
#include <Windows.h>  
using namespace std;  
  
DWORD WINAPI someFunction(LPVOID lpParam)  
{  
    cout << "enter someFunction!" << endl;  
    Sleep(1000);  
    cout << "This is someFunction!" << endl;  
    Sleep(1000);  
    cout << "exit someFunction!" << endl;  
    return 0;  
}  
  
int main()  
{  
    HINSTANCE hinstance = LoadLibrary("mydll.dll");  
    if(hinstance!=NULL)  
    {  
        cout << "Load successfully!" << endl;  
    }else {  
        cout << "Load failed" << endl;  
    }  
    HANDLE hThread;  
    DWORD dwThreadId;  
      
    cout << "createThread before " << endl;  
    hThread = CreateThread(NULL,0,someFunction,NULL,0,&dwThreadId);  
    cout << "createThread after " << endl;  
    cout << endl;  
      
    Sleep(3000);  
  
    cout << "waitForSingleObject before " << endl;  
    WaitForSingleObject(hThread,INFINITE);  
    cout << "WaitForSingleObject after " << endl;  
    cout << endl;  
  
    FreeLibrary(hinstance);  
    return 0;  
}