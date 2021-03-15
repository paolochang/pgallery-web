import { isLoggedInVar } from "../apollo";

const Home: React.FC = () => {
    return (
        <div>
            <h1>Home</h1>
            <button onClick={() => isLoggedInVar(false)}>Logout</button>
        </div>
    )
}
export default Home;