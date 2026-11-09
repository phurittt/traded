const Title = (props) => {

    console.log('result', props)
    console.log('manunited')

    return (
        <div>
            title...{props.txt}
            price = {props.price} 
        </div>
        
    )
}

export default Title