from pydantic import BaseModel


class InterpRequest(BaseModel):
    x: list[float]
    y: list[float]
    n_points: int = 50


class InterpResponse(BaseModel):
    polynomial: str
    points: list[dict]


class WaveRequest(BaseModel):
    function_type: str = "cos"
    n_control: int = 8
    n_points: int = 200
    x_min: float = 0.0
    x_max: float = 4.0


class WaveResponse(BaseModel):
    function_type: str
    x: list[float]
    y: list[float]
    available_functions: list[str]
