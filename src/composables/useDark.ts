const isDark=ref(false)
export function useDark(){
    function toggleDark(){
        isDark.value=!isDark.value
        if(isDark.value){
            document.body.classList.add('dark')
        }else{
            document.body.classList.remove('dark')
        }
    }
    return {isDark,toggleDark}
}