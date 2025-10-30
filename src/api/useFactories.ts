export interface Factory {
  name: string
  timezone: string
}

const useFactories = () => {
  const API_URL = "http://localhost:8080/factories"

  const getFactories = async (): Promise<Factory[]> => {
    try {
    const factories: Factory[] = await fetch(API_URL).then(res => res.json())
    return factories
    } catch(err) {
      console.error(err, "Error fetching factories");
      return []
    }
  }

  const addNewFactory = async (factory: Factory): Promise<Factory> => {
    try {
      const newFactory: Factory = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(factory)
      }).then(res => res.json())
      return newFactory
    }
    catch(err) {
      console.error(err, "Error adding new factory");
      throw err
    }
  }

  const deleteFactory = async (factory: Factory): Promise<Factory> => {
    try {
      const factoryName = factory.name
      const result = await fetch(`${API_URL}/${factoryName}`, {
        method: "DELETE",
      }).then(res => res.json())
      return result
    }
    catch(err) {
      console.error(err, "Error deleting factory");
      throw err
    }
  }
  return { getFactories, addNewFactory, deleteFactory }
}

export default useFactories;