#include <Windows.h>  
#include <stdio.h>  
  
int main()  
{  
    HINSTANCE h = LoadLibrary("mydll2.dll");  
    int(*pAdd)(int,int);  
    pAdd = (int(__cdecl *)(int,int))(GetProcAddress(h,"Add"));  
    int sum = pAdd(239,23);  
    printf("sum is %d\n",sum);  
    FreeLibrary(h);  
    return 0;  
}