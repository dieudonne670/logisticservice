# tracking/services.py
import vroom

def optimize_route(jobs, vehicles, osrm_server="localhost:5000"):
    """
    jobs: list of dicts with 'id', 'location' (lat,lng)
    vehicles: list of dicts with 'id', 'start', 'end'
    """
    problem = vroom.Input()

    # Use OSRM as routing engine (free, self-hosted)
    problem.set_durations_matrix(
        profile="car",
        matrix_input=[[0, 2104, 197],
                      [2103, 0, 2255],
                      [197, 2256, 0]]  # You'd compute this via OSRM
    )

    for v in vehicles:
        problem.add_vehicle(vroom.Vehicle(v['id'], start=v['start'], end=v['end']))

    for j in jobs:
        problem.add_job(vroom.Job(j['id'], location=j['location']))

    solution = problem.solve(exploration_level=5, nb_threads=4)
    return solution.routes