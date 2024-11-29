import { Source } from "../../classes/source";

export default function ModifySourcesView(props: {
    showModifySources: boolean,
    setShowModifySources: Function,
    sourceData: Source[],
    setSourceData: Function}
) {
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        // Prevent the browser from reloading the page
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const source: Source = Source.fromFormData(formData);
        console.log(source);

        // todo validate data

        if (props.sourceData == null ||
            props.sourceData.every(existing => existing.name != source.name && existing.path != source.path)) {
            const newSourceData = props.sourceData == null ? [source] : props.sourceData.concat(source);
            props.setSourceData(newSourceData);
        } else {
            // todo user error
            console.log("source already exists!");
        }
    }

    // todo window modal for path
    return (<div hidden={!props.showModifySources}>
        <form method="post" onSubmit={handleSubmit}>
            <label>Source name: <input name="name" /></label><hr />
            <label>Directory path: <input name="path" /></label><hr />
            <label>Do files have a header line? <input type="checkbox" name="hasHeader" /></label><hr />
            <label>Amount column index: <input name="amountIdx" /></label><hr />
            <label>Is amount debt? <input type="checkbox" name="isDebt" /></label><hr />
            <label>Date column index: <input name="dateIdx" /></label><hr />
            <label>Description column index: <input name="desciptionIdx" /></label><hr /> 
            <hr />
            <button type="submit">Save Changes</button>
        </form>
    </div>);
}