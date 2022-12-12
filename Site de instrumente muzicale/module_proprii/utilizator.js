

checkName(nume)
{
        return nume!="" && nume.match(new RegExp("^[A-Z][a-z]+$")) ;
}



checkUsername(username)
{
        return username!="" && username.match(new RegExp("^[A-Z][a-z]+$")) ;
}