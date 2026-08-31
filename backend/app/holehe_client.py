import asyncio
import importlib
import pkgutil
from typing import Any

import httpx


def _import_submodules(package: str) -> dict:
    pkg = importlib.import_module(package)
    results = {}
    for loader, name, is_pkg in pkgutil.walk_packages(pkg.__path__):
        full_name = pkg.__name__ + "." + name
        results[full_name] = importlib.import_module(full_name)
        if is_pkg:
            results.update(_import_submodules(full_name))
    return results


def _get_functions(modules: dict) -> list:
    websites = []
    for module_name in modules:
        if len(module_name.split(".")) > 3:
            site = module_name.split(".")[-1]
            websites.append(modules[module_name].__dict__[site])
    return websites


async def check_email(email: str, timeout: int = 10) -> list[dict[str, Any]]:
    modules = _import_submodules("holehe.modules")
    websites = _get_functions(modules)
    out: list[dict[str, Any]] = []

    async with httpx.AsyncClient(timeout=httpx.Timeout(timeout)) as client:
        tasks = [_launch(web, email, client, out) for web in websites]
        await asyncio.gather(*tasks, return_exceptions=True)

    out.sort(key=lambda i: i.get("name", ""))
    return out


async def _launch(module_fn, email: str, client: httpx.AsyncClient, out: list) -> None:
    try:
        await module_fn(email, client, out)
    except Exception:
        name = _module_name(module_fn)
        out.append({
            "name": name,
            "domain": "",
            "exists": False,
            "emailrecovery": None,
            "phoneNumber": None,
            "others": None,
            "rateLimit": False,
        })


def _module_name(module_fn) -> str:
    return str(module_fn).split("<function ")[1].split(" ")[0]