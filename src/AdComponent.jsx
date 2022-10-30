import './ads.css'
export default function AdComponent(props){
    return <div style={{backgroundImage:`url(${require(`./pics/${props.image}`)})`}} className="ads" onClick={
        ()=>{
            window.location.href=`https://${props.url}`
        }
    }>  
        <h3>{props.headline}</h3>
        <p>{props.primaryText}</p>
        <p>{props.description}</p>
    </div>
}