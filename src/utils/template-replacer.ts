export function replaceTemplateVariables(
    template: string,
    variables: Record<
        string,
        string | number | Record<string, string>
    >
): string {
    let result = template;

    for (const [key, value] of Object.entries(variables)) {
        const placeholder = `{${key}}`;
        result = result.replace(
            new RegExp(placeholder, 'g'),
            String(value)
        );
    }

    return result;
}
