#include <Windows.h>  
#include <stdio.h>  
extern "C"{  
class _declspec(dllexport) A{  
public:  
    A(){  
        printf("A construct...\n");  
    }  
    const char * whoIsMe()  
    {  
        return "My name is A";  
    }  
    ~A(){  
        printf("A deconstruct...\n");  
    }  
};  
  
_declspec(dllexport) A a;  
  
_declspec(dllexport) int Add(int x,int y)  
{  
    return x+y;  
}  
  
_declspec(dllexport) int g_nUsageCount = 3195;  
}