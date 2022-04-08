const isDark=ref(false)
export function useDark(){
    function toggleDark(){
        isDark.value=!isDark.value
        let html=document.querySelector('html') as HTMLHtmlElement
        if(isDark.value){
            html.classList.add('dark')
        }else{
            html.classList.remove('dark')
        }
    }
    return {isDark,toggleDark}
}